package com.external.plugins.commands;

import com.appsmith.external.models.ActionConfiguration;
import com.appsmith.external.models.Property;
import lombok.Getter;
import lombok.Setter;
import org.pf4j.util.StringUtils;

import java.util.List;

import static com.external.plugins.MongoPluginUtils.validConfigurationPresent;
import static com.external.plugins.constants.ConfigurationIndex.DISTINCT_KEY;
import static com.external.plugins.constants.ConfigurationIndex.DISTINCT_QUERY;

@Getter
@Setter
public class Distinct extends BaseCommand{
    String query;
    String key;

    Distinct(ActionConfiguration actionConfiguration) {
        super(actionConfiguration);

        List<Property> pluginSpecifiedTemplates = actionConfiguration.getPluginSpecifiedTemplates();

        if (validConfigurationPresent(pluginSpecifiedTemplates, DISTINCT_QUERY)) {
            this.query = (String) pluginSpecifiedTemplates.get(DISTINCT_QUERY).getValue();
        }

        if (validConfigurationPresent(pluginSpecifiedTemplates, DISTINCT_KEY)) {
            this.key = (String) pluginSpecifiedTemplates.get(DISTINCT_KEY).getValue();
        }
    }

    @Override
    public Boolean isValid() {
        if (super.isValid()) {
            if (!StringUtils.isNullOrEmpty(query) && !StringUtils.isNullOrEmpty(key)) {
                return Boolean.TRUE;
            }
        }
        return Boolean.FALSE;
    }
}
